import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { LIFE_SECRET, REFRESH_TOKEN_LIFE_EXPIRES, REFRESH_TOKEN_SECRET, SECRET, TOKEN_LIFE_EXPIRES, } from 'src/config';
import { CompanyEntity } from 'src/entities/Company.entity';
import { CompanySettingEntity } from 'src/entities/CompanySetting.entity';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { PackageEntity } from 'src/entities/Package.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { SubscriptionEntity } from 'src/entities/Subscription.entity';
import { UserEntity } from 'src/entities/User.entity';
import { DataStoredInToken } from 'src/shared/interfaces/DataStoreInToken.interface';
import { TokenData } from 'src/shared/interfaces/TokenData.interface';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { CreateStoreDto, CreateUserDto } from './dto/createUser.dto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { RedisCacheService } from '../cache/redisCache.service';
import { PostDataDto } from './dto/PostData.dto';
import { FindUsersDto } from './dto/FindUsers.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { UpdateMyUserDto } from './dto/UpdateMyUser.dto';
import { BillingEntity } from 'src/entities/Billing.entity';
import { RewardEntity } from 'src/entities/Reward.entity';
import { UserGateway } from './user.gateway';
import { PermissionEntity } from 'src/entities/Permission.entity';
import { AddressEntity } from 'src/entities/Address.entity';
import { validate } from 'class-validator';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import crypto = require('crypto');
import { getAuth } from 'firebase-admin/auth';
import { UserTokenDTO } from './dto/user-token.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { LoginDto } from './dto/login.dto';
import { AppointmentSettingEntity } from 'src/entities/AppointmentSetting.entity';
import { NotifyService } from '../notify/notify.service';

@Injectable()
export class UserService {
  constructor(
    private emailService: EmailService,
    private cache: RedisCacheService,
    @Inject(forwardRef(() => UserGateway))
    private userGateway: UserGateway,
    private readonly notifyService: NotifyService
  ) { }


  async createUser(_user: CreateUserDto) {
    const { email, password, store, packageId, fullName } = _user;

    const findUser = await UserEntity.findOneBy({ email: email });
    if (findUser) {
      throw new HttpException('User already existed!!', HttpStatus.CONFLICT);
    }

    let user = new UserEntity();
    let companyStore = store as StoreEntity;
    companyStore.email = email;
    user.fullName = fullName ? fullName : null;
    user.email = email;
    user.password = password;
    user.hashPassword();

    let company = new CompanyEntity();
    company.name = companyStore.name;
    company.address = companyStore.address;
    company.city = companyStore.city;
    company.state = companyStore.state;
    company.zipcode = companyStore.zipcode;
    company.categories = companyStore.categories;
    company.phoneNumber = companyStore.phoneNumber;
    company.isActive = false;
    company = await CompanyEntity.save(company);

    companyStore.companyId = company.id;
    companyStore.secretKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let storeDomainName = companyStore.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
    const similarStoreNames = await StoreEntity.createQueryBuilder("store")
      .where("store.subDomain LIKE :storeDomainName", { storeDomainName: `${storeDomainName}%` })
      .getCount();

    if (similarStoreNames > 0) storeDomainName = storeDomainName + similarStoreNames;

    companyStore.subDomain = storeDomainName;
    companyStore = await StoreEntity.save(companyStore);

    let openHours = [];
    for (let i = 0; i < 7; i++) {
      openHours.push(<OpenHourEntity>{
        day: i,
        open: true,
        storeId: companyStore.id,
      })
    }
    OpenHourEntity.save(openHours);

    const companySetting = new CompanySettingEntity();
    companySetting.companyId = company.id;

    CompanySettingEntity.save(companySetting);

    // create AppointmentSetting
    const appSetting = new AppointmentSettingEntity();
    appSetting.storeId = companyStore.id;
    appSetting.save();

    const storeSetting = new StoreSettingEntity();
    storeSetting.storeId = companyStore.id;
    storeSetting.save();

    user.company = company;
    await user.save();
    // Send verify email
    // this.sendVerificationEmail(user.email, company.name);
    user.password = undefined;
    user.tempPassword = undefined;
    user.tempPasswordExpire = undefined;
    const token = await this.createToken(user, companyStore.id);
    const resonpose = { userInfo: user, accessToken: token };
    return resonpose;
  }

  async sendVerificationEmail(email: string, name: string) {
    try {
      const code = Math.floor(100000 + Math.random() * 900000);
      const user = await UserEntity.findOneBy({ email: email });
      user.emailVerifyCode = code.toString();
      await user.save();
      this.emailService.sendVerifyEmail(email, name, code.toString());
    } catch (err) {
      console.log(err);
    }
  }

  async createAccount(_user: CreateAccountDto) {
    const { email, fullName, password, packageId } = _user;

    const findUser = await UserEntity.findOneBy({ email });
    if (findUser) {
      throw new HttpException('User already existed!!', HttpStatus.CONFLICT);
    }
    const businessName: string = fullName || 'New Business';

    const user = new UserEntity();
    let companyStore = new StoreEntity();
    companyStore.email = email;
    companyStore.name = businessName;
    user.email = email;
    user.password = password;
    user.hashPassword();
    let company = new CompanyEntity();
    company.name = businessName;
    company = await CompanyEntity.save(company);
    if (packageId) {
      const subs = new SubscriptionEntity();
      subs.companyId = company.id;
      subs.packageId = packageId;
      await subs.save();
    } else {
      const _package = await PackageEntity.findOne({
        where: { isDefault: true },
      });
      if (_package) {
        const subs = new SubscriptionEntity();
        subs.companyId = company.id;
        subs.packageId = _package.id;
        await subs.save();
      }
    }

    companyStore.companyId = company.id;
    companyStore.secretKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let storeDomainName = companyStore.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '');
    const similarStoreNames = await StoreEntity.createQueryBuilder('store').where('store.subDomain LIKE :storeDomainName', { storeDomainName: `${storeDomainName}%`, }).getCount();

    if (similarStoreNames > 0)
      storeDomainName = storeDomainName + similarStoreNames;

    companyStore.subDomain = storeDomainName;
    companyStore = await StoreEntity.save(companyStore);
    companyStore.openHours = [];
    for (let i = 0; i < 7; i++) {
      const openHour = <OpenHourEntity>{
        day: i,
        open: true,
        storeId: companyStore.id,
      };
      await OpenHourEntity.save(openHour);
      companyStore.openHours.push(openHour);
    }

    const companySetting = new CompanySettingEntity();
    companySetting.companyId = company.id;

    // create AppointmentSetting
    const appSetting = new AppointmentSettingEntity();
    appSetting.storeId = companyStore.id;
    appSetting.save();

    //TODO add google place API to get review link
    //google review link  =https://search.google.com/local/writereview?placeid=

    await CompanySettingEntity.save(companySetting);

    const storeSetting = new StoreSettingEntity();
    storeSetting.storeId = companyStore.id;
    storeSetting.save();

    user.company = company;
    user.save();
    // Send verify email
    this.sendVerificationEmail(user.email, company.name);
    // delete user.password
    return companyStore;
  }

  async createToken(user: UserEntity, storeId?: number) {
    const dataStoredInToken: DataStoredInToken = {
      userId: user.id,
      companyId: user.company?.id ? user.company?.id : user.companyId,
      storeId: storeId,
      roleIds: user.permissionIds,
    };

    const response: TokenData = {
      expiresIn: TOKEN_LIFE_EXPIRES,
      token: jwt.sign(dataStoredInToken, LIFE_SECRET, { expiresIn: TOKEN_LIFE_EXPIRES, }),
      refreshToken: jwt.sign(dataStoredInToken, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE_EXPIRES, }),
    };

    return response;
  }

  async login(body: LoginDto) {
    const { email, password } = body;
    if (!(email && password)) throw new HttpException('Wrong credentials provided', HttpStatus.FORBIDDEN,);

    let user = await UserEntity.createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()

    if (!user.isActive) throw new HttpException("Account does not exist!", HttpStatus.BAD_REQUEST)

    if (!user) throw new HttpException('Account suppended', HttpStatus.SERVICE_UNAVAILABLE,);

    if (user.checkIfUnencryptedPasswordIsValid(password) || (password === user.tempPassword && new Date(user.tempPasswordExpire) > new Date())) {
      const tokenData = await this.createToken(user);
      this.cache.set(tokenData.refreshToken, tokenData.token);
      const response = { id: user.id, accessToken: tokenData };
      if (user.tempPassword && password !== user.tempPassword) {
        user.tempPassword = null;
        user.tempPasswordExpire = null;
        await user.save();
      }

      if (body?.deviceToken) {
        let topic = body.email.replace(/[^\w\s]/gi, '')
        let result = await this.notifyService.subscribeNotiTopic(topic, body.deviceToken)
        if (result.successCount == 1) {
          UserEntity.createQueryBuilder().update({ topicNoti: topic }).where("email = :email", { email }).execute()
        }
      }

      return response;
    } else {
      throw new HttpException('Wrong credentials provided', HttpStatus.FORBIDDEN,);
    }
  }

  async logout(refreshToken: string, userId: number, deviceToken?: string) {
    if (refreshToken) this.cache.delete(refreshToken);
    const user = await this.getUserByID(userId);
    let topic = user.email.replace(/[^\w\s]/gi, '')
    this.notifyService.unSubscriptionNotiTopic(topic, deviceToken);
    return { success: true };
  }

  async refreshToken(_postData: PostDataDto) {
    const token = await this.cache.get(_postData.refreshToken);

    if (!token) throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);

    if (_postData.token !== token) throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);

    try {
      const decoded = jwt.verify(_postData.refreshToken, REFRESH_TOKEN_SECRET,) as DataStoredInToken;

      const tokenData = { userId: decoded.userId, companyId: decoded.companyId, storeId: decoded.storeId, roleIds: decoded.roleIds, };

      const newToken = jwt.sign(tokenData, LIFE_SECRET, { expiresIn: TOKEN_LIFE_EXPIRES, });
      const newRefreshToken = jwt.sign(tokenData, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE_EXPIRES, });

      this.cache.delete(_postData.refreshToken);
      this.cache.set(newRefreshToken, newToken);
      const response = { expiresIn: TOKEN_LIFE_EXPIRES, token: newToken, refreshToken: newRefreshToken, };
      return response;
    } catch (error) {
      throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserByID(userId: number) {
    const user = await UserEntity.createQueryBuilder('user').leftJoinAndSelect("user.company", "company").where("user.id = :userId", { userId }).getOne();
    if (!user) throw new HttpException(`User with id ${userId} not found`, HttpStatus.NOT_FOUND,);
    return user;
  }

  async findUsers(_findUsers: FindUsersDto, companyId: number) {
    const skip: number = _findUsers.pageNumber ? +_findUsers.pageNumber : 0;
    const take: number = _findUsers.pageSize ? +_findUsers.pageSize : 10;
    const sortField: string = _findUsers.sortField ? _findUsers.sortField : '';
    const sortOrder = _findUsers.sortOrder == 'asc' ? 'ASC' : 'DESC';
    let search: string;
    if (_findUsers.search) {
      search = _findUsers.search;
    } else if (_findUsers.filter) {
      search = _findUsers.filter;
    } else {
      search = '';
    }

    const query = UserEntity
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.address', 'address')
      .where({ companyId })
      .andWhere(`(user.email LIKE :keywork OR user.fullName LIKE :keywork)`, { keywork: `%${search}%` })
      .take(take)
      .skip(skip)

    if (sortField) {
      query.orderBy('user.' + sortField, sortOrder);
    }
    return query.getMany();
  }

  async forgotPassword(email: string): Promise<{ status: Boolean }> {
    // const user = await UserEntity.findOne({ email });
    const user = await UserEntity.createQueryBuilder('user').where('user.email = :email', { email }).getOne();

    // if (!user) return { email: email };
    if (!user) return { status: false };

    let randomstring = '';
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    const string_length = 8;
    for (let i = 0; i < string_length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }

    user.tempPassword = randomstring;
    const nextDate = new Date();
    //Send email with password
    this.emailService.sendForgotEmail(user.email, user.fullName, user.tempPassword,);
    nextDate.setTime(new Date().getTime() + 1000 * 24 * 3600);
    user.tempPasswordExpire = nextDate;
    UserEntity.save(user);

    return { status: true };
  }

  async checkUsername(email: string): Promise<{ match: boolean }> {
    const result = await UserEntity.findOneBy({ email });
    return { match: !!result }
  }

  async changePassword(body: ChangePasswordDto, id: number, res: Response,) {
    //Get ID from JWT
    let user: UserEntity;
    try {
      user = await UserEntity.findOneOrFail({ where: { id: id } });
    } catch (error) {
      throw new UnauthorizedException();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(body.oldPassword)) {
      throw new UnauthorizedException();
    }
    //Validate de model (password lenght)
    user.password = body.newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    UserEntity.save(user);

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  myUser(id: number) {
    return UserEntity.createQueryBuilder('user').leftJoinAndSelect("user.company", "company").where("user.id = :id", { id }).getOne()
  }

  async updateMyUser(profile: UpdateMyUserDto) {
    if (profile.oldPassword && profile.newPassword) {
      const user = await UserEntity.createQueryBuilder('user').addSelect("user.password").where("user.id = :id", { id: profile.id }).getOne();
      //Check if old password matchs
      if (!user.checkIfUnencryptedPasswordIsValid(profile.oldPassword)) {
        throw new HttpException('Password incorrect!', HttpStatus.FORBIDDEN);
      }
      user.password = profile.newPassword;
      user.hashPassword();
      UserEntity.save(user);
    }
    profile.oldPassword = undefined;
    profile.newPassword = undefined;

    let myProfile = profile as UserEntity

    await UserEntity.createQueryBuilder().update(myProfile).where('id = :id', { id: profile.id }).execute();
    return this.getUserByID(profile.id);
  }

  async verifyEmail(code: string, email: string) {
    const user = await UserEntity.findOneBy({ email: email });
    if (user.emailVerified) return user;

    if (user.emailVerifyCode !== code) throw new HttpException('wrong code', HttpStatus.NOT_FOUND);

    user.emailVerified = true;
    await user.save();

    const company = await CompanyEntity.findOne({ where: { id: user.companyId }, });
    company.isActive = true;
    await company.save();
    //new sample reward
    const store = await StoreEntity.findOne({ where: { companyId: user.companyId }, });

    const reward = new RewardEntity();
    reward.storeId = store.id;
    reward.name = '10% off on next order';
    reward.pointRequired = 10;
    await reward.save();
    user.company = company;

    // this.emailService.newAccount(user.email, company.name);
    return user;
  }

  deleteUser(userId: number) {
    // UserEntity.delete(userId);
    UserEntity.createQueryBuilder().update({ isActive: false }).where("id = :userId", { userId }).execute();
    return { message: 'delete' };
  }

  async sendVerifyEmailAgain(email: string) {
    const user = await UserEntity.findOne({ where: { email: email }, relations: ['company'] });

    if (user) this.sendVerificationEmail(email, user.company.name);
    return { message: 'sent' };
  }

  async updateUser(user: UserEntity, companyId: number) {
    //new user
    if (!user.id) {
      const result = await UserEntity.findOne({ where: { email: user.email }, });
      if (result)
        throw new HttpException('User already existed', HttpStatus.CONFLICT);

      user.companyId = companyId;
      if (user.password) {
        user.hashPassword();
      } else {
        let randomstring = '';
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        const string_length = 8;
        for (let i = 0; i < string_length; i++) {
          const rnum = Math.floor(Math.random() * chars.length);
          randomstring += chars.substring(rnum, rnum + 1);
        }
        user.tempPassword = randomstring;
        user.password = randomstring;
        const nextDate = new Date();
        //Send email with password
        this.emailService.sendNewUserPassword(user.email, user.fullName ? user.fullName : '', randomstring,);
        nextDate.setTime(new Date().getTime() + 1000 * 24 * 3600);
        user.tempPasswordExpire = nextDate;
      }
      // user.roleIds = null;
      user.isCreator = false;
      user.address = null;
      await UserEntity.save(user);
    } else {
      if (user.permissionIds && user.permissionIds.length > 0) {
        const roles = await PermissionEntity.createQueryBuilder('permission').where('permission.id IN (:...permissionIds)', { permissionIds: user.permissionIds, }).getMany();
        user.permissions = roles;
      }

      if (user.password.length < 128) {
        const newUser = new UserEntity();
        newUser.password = user.password;
      }

      UserEntity.save(user);
    }
    return this.myUser(user.id);
  }

  async socialLogin(body: FirebaseAuthDto, type: { idToken: string; isFacebook?: boolean; isGoogle?: boolean; isApple?: boolean }) {
    const bodyEmail = body.email ?? body.providerData[0].email;
    if (!bodyEmail) {
      throw new BadRequestException('No data ');
    }
    const _user = await this.findOne(bodyEmail);

    //Signup
    if (!_user) {
      const idToken = type.idToken.replace('Bearer ', '');
      const decodedToken = await getAuth().verifyIdToken(idToken);
      return this.create(
        {
          email: bodyEmail,
          password: body.uid,
          name: body.displayName,
          deviceToken: body.deviceToken,
          store: body.store
        },
        {
          isFacebook: type.isFacebook ?? false,
          isGoogle: type.isGoogle ?? false,
          isApple: type.isApple ?? false,
          isEmailVerify: body.emailVerified ?? false,
          image: body.photoURL,
          decodedToken: decodedToken.uid,
        },
      );
    }
    const errors = { User: ' not found' };
    if (type.idToken) {
      const idToken = type.idToken.replace('Bearer ', '');
      const decodedToken = await getAuth().verifyIdToken(idToken);

      if (body.uid === decodedToken.uid) {
        if (!_user.isActive) UserEntity.update(_user.id, { isActive: true });

        // if (body?.deviceToken) {
        //   // let topic = body.email.replace(/[^\w\s]/gi, '')
        //   // let result = await this.notifyService.subscribeNotiTopic(topic, body.deviceToken)
        //   // if (result.successCount == 1) {
        //   //   UserEntity.createQueryBuilder().update({ topicNoti: topic }).where("email = :email", { email: _user.email }).execute()
        //   // }
        // }

        const store = await StoreEntity.createQueryBuilder('store').where("store.companyId = :companyId", { companyId: _user.company.id }).getOne();
        return this.buildUserRO(_user.email, store.id);
      }
    }
    //deprecated
    if (body.uid === _user.googleId || body.uid === _user.facebookId || body.uid === _user.appleId) {
      const token = this.generateJWT(_user);
      const { email, fullName, image } = _user;
      const user: UserTokenDTO = { email, token, name: fullName, image };

      if (!_user.isActive) UserEntity.update(_user.id, { isActive: true });

      if (body?.deviceToken) {
        let topic = body.email.replace(/[^\w\s]/gi, '')
        let result = await this.notifyService.subscribeNotiTopic(topic, body.deviceToken)
        if (result.successCount == 1) {
          UserEntity.createQueryBuilder().update({ topicNoti: topic }).where("email = :email", { email: _user.email }).execute()
        }
      }

      return user;
    }
    throw new HttpException({ errors }, 401);
  }

  findOne(email: string): Promise<UserEntity> {
    return UserEntity.createQueryBuilder('user')
      .select(['user.fullName', 'user.id', 'user.image', 'user.email', 'user.isActive',])
      .leftJoinAndSelect('user.company', 'company')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(dto: CreateUserDTO, socialSignup?: { isFacebook?: boolean; isGoogle?: boolean; isApple?: boolean; isEmailVerify?: boolean; image?: string; decodedToken?: string; },) {
    // check uniqueness of phone/email
    const { email } = dto;
    const qb = UserEntity.createQueryBuilder('user').where('user.email = :email', { email });

    const user = await qb.getOne();
    if (user) {
      const errors = { username: 'Email must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST,);
    }

    const companyId = await this.newCompany({ name: 'softyn72' })

    // create new user
    const newUser = new UserEntity();
    newUser.fullName = dto.name ?? 'User';
    newUser.email = email;
    newUser.password = this.hashPassword(dto.password);
    newUser.companyId = companyId;

    // const store = await this.createStore(companyId, dto.store)
    const store = await this.createStore(companyId, dto.store)

    if (socialSignup) {
      newUser.facebookId = socialSignup.isFacebook ? socialSignup.decodedToken : undefined;
      newUser.googleId = socialSignup.isGoogle ? socialSignup.decodedToken : undefined;
      newUser.appleId = socialSignup.isApple ? socialSignup.decodedToken : undefined;
      newUser.emailVerified = socialSignup.isEmailVerify;
      newUser.image = socialSignup.image;
    }
    const errors = await validate(newUser);

    if (errors.length > 0) {
      const _errors = { username: 'User input is not valid.' };
      throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST,);
    } else {
      const savedUser = await UserEntity.save(newUser);
      if (dto?.deviceToken) {
        let topic = dto.email.replace(/[^\w\s]/gi, '')
        let result = await this.notifyService.subscribeNotiTopic(topic, dto.deviceToken)
        if (result.successCount == 1) {
          UserEntity.createQueryBuilder().update({ topicNoti: topic }).where("email = :email", { email }).execute()
        }
      }

      return this.buildUserRO(savedUser.email, store.id)
    }
  }

  async createStore(companyId: number, body: CreateStoreDto) {

    const secretKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let storeDomainName = body ? body.name : '';
    if (storeDomainName) {
      storeDomainName = body?.name?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
      const similarStoreNames = await StoreEntity.createQueryBuilder("store")
        .where("store.subDomain LIKE :storeDomainName", { storeDomainName: `${storeDomainName}%` })
        .getCount();

      if (similarStoreNames > 0) storeDomainName = storeDomainName + similarStoreNames;
    }

    const store = await StoreEntity.save(<StoreEntity>{
      name: body ? body.name ? body.name : 'string' : 'string',
      companyId: companyId,
      secretKey: secretKey,
      subDomain: storeDomainName,
    });

    return store;
  }

  private async buildUserRO(email: string, storeId?: number) {
    const _user = await this.findOne(email)
    const token = await this.createToken(_user, storeId)

    const userRO = {
      ..._user,
      id: _user.id,
      name: _user.fullName,
      email: _user.email,
      image: _user.image,
      zipcodeRequest: true,
    };

    const resonpose = {
      userInfo: userRO,
      accessToken: token
    }

    return resonpose;
  }

  hashPassword(password: string) {
    const salt = crypto.randomBytes(32).toString('hex');
    const password_hash = crypto.createHash('sha256').update(salt + password).digest('hex');
    password = salt + password_hash;
    return password;
  }

  public generateJWT(user: UserEntity) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({ id: user.id, name: user.fullName }, SECRET, {});
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, encryptedPassword: string,) {
    const salt = encryptedPassword.substring(0, 64);
    const hash = encryptedPassword.substring(64);
    const password_hash = crypto.createHash('sha256').update(salt + unencryptedPassword).digest('hex');
    return hash === password_hash;
  }

  async newCompany(company: CreateCompanyDto) {
    let _company = new CompanyEntity();
    _company.name = company.name;
    _company.address = company.address;
    _company.city = company.city;
    _company.state = company.state;
    _company.zipcode = company.zipcode;
    _company.categories = company.categories;
    _company.phoneNumber = company.phoneNumber;
    _company.isActive = false;
    _company = await CompanyEntity.save(_company);
    return _company.id
  }

  async updateCompany(id: number, updatecompany: CreateStoreDto) {
    let company = await CompanyEntity.findOneBy({ id });
    company.name = updatecompany.name;
    company.address = updatecompany.address;
    company.city = updatecompany.city;
    company.state = updatecompany.state;
    company.zipcode = updatecompany.zipcode;
    company.categories = updatecompany.categories;
    company.phoneNumber = updatecompany.phoneNumber;
    company.isActive = false;
    return CompanyEntity.save(company);
  }

  getConfirmationCode() {
    return crypto.randomBytes(10).toString('hex')
  }



}
