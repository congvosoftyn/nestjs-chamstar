import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { LIFE_SECRET, REFRESH_TOKEN_LIFE_EXPIRES, REFRESH_TOKEN_SECRET, SECRET, TOKEN_LIFE_EXPIRES, } from 'src/config';
import { CompanySettingEntity } from 'src/entities/CompanySetting.entity';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { StoreSettingEntity } from 'src/entities/StoreSetting.entity';
import { UserEntity } from 'src/entities/User.entity';
import { DataStoredInToken } from 'src/shared/interfaces/DataStoreInToken.interface';
import { TokenData } from 'src/shared/interfaces/TokenData.interface';
import { EmailService } from '../email/email.service';
import { CreateStoreDto, CreateUserDto } from './dto/createUser.dto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { RedisCacheService } from '../cache/redisCache.service';
import { PostDataDto } from './dto/PostData.dto';
import { FindUsersDto } from './dto/FindUsers.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { UpdateMyUserDto } from './dto/UpdateMyUser.dto';
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
    private readonly notifyService: NotifyService
  ) { }


  async createUser(_user: CreateUserDto) {
    const { email, password, store, packageId, fullName } = _user;

    const findUser = await UserEntity.findOneBy({ email: email });
    if (findUser) {
      throw new HttpException('User already existed!!', HttpStatus.CONFLICT);
    }

    let user = new UserEntity();
    let _store = store as StoreEntity;
    _store.email = email;
    user.fullName = fullName ? fullName : null;
    user.email = email;
    user.password = password;
    user.hashPassword();


    _store = await StoreEntity.save(_store);

    let openHours = [];
    for (let i = 0; i < 7; i++) {
      openHours.push(<OpenHourEntity>{
        day: i,
        open: true,
        storeId: _store.id,
      })
    }
    OpenHourEntity.save(openHours);

    const companySetting = new CompanySettingEntity();
    companySetting.storeId = _store.id;

    CompanySettingEntity.save(companySetting);

    // create AppointmentSetting
    const appSetting = new AppointmentSettingEntity();
    appSetting.storeId = _store.id;
    appSetting.save();

    const storeSetting = new StoreSettingEntity();
    storeSetting.storeId = _store.id;
    storeSetting.save();
    await user.save();

    user.password = undefined;
    const token = await this.createToken(user, _store.id);
    const resonpose = { userInfo: user, accessToken: token };
    return resonpose;
  }

  async sendVerificationEmail(email: string, name: string) {
    try {
      const code = Math.floor(100000 + Math.random() * 900000);
      const user = await UserEntity.findOneBy({ email: email });
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
    let store = new StoreEntity();
    store.email = email;
    store.name = businessName;
    user.email = email;
    user.password = password;
    user.hashPassword();
  
    store = await StoreEntity.save(store);
    store.openHours = [];

    for (let i = 0; i < 7; i++) {
      const openHour = <OpenHourEntity>{
        day: i,
        open: true,
        storeId: store.id,
      };
      await OpenHourEntity.save(openHour);
      store.openHours.push(openHour);
    }

    const companySetting = new CompanySettingEntity();
    companySetting.storeId = store.id;

    // create AppointmentSetting
    const appSetting = new AppointmentSettingEntity();
    appSetting.storeId = store.id;
    appSetting.save();

    await CompanySettingEntity.save(companySetting);

    const storeSetting = new StoreSettingEntity();
    storeSetting.storeId = store.id;
    storeSetting.save();

    user.save();
 
    return store;
  }

  async createToken(user: UserEntity, storeId?: number) {
    let store = await StoreEntity.createQueryBuilder('store').where("store.userId = :id", { id: user.id }).getOne();
    let _storeId = storeId ? storeId : store.id;

    const dataStoredInToken: DataStoredInToken = {
      userId: user.id,
      storeId: _storeId,
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

    const tokenData = await this.createToken(user);
    this.cache.set(tokenData.refreshToken, tokenData.token);
    const response = { id: user.id, accessToken: tokenData };
    return response;
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

      const tokenData = { userId: decoded.userId, storeId: decoded.storeId };

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
    return UserEntity.findOneBy({ email: email });
  }

  deleteUser(userId: number) {
    // UserEntity.delete(userId);
    UserEntity.createQueryBuilder().update({ isActive: false }).where("id = :userId", { userId }).execute();
    return { message: 'delete' };
  }

  async updateUser(user: UserEntity) {
    //new user
    if (!user.id) {
      const result = await UserEntity.findOne({ where: { email: user.email }, });
      if (result) throw new HttpException('User already existed', HttpStatus.CONFLICT);

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
        user.password = randomstring;
      }
      user.isCreator = false;
      user.address = null;
      await UserEntity.save(user);
    } else {
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
        const store = await StoreEntity.createQueryBuilder('store').where("store.id = :id", { id: _user.id }).getOne();
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

    // create new user
    const newUser = new UserEntity();
    newUser.fullName = dto.name ?? 'User';
    newUser.email = email;
    newUser.password = this.hashPassword(dto.password);

    const store = await this.createStore(dto.store)

    if (socialSignup) {
      newUser.facebookId = socialSignup.isFacebook ? socialSignup.decodedToken : undefined;
      newUser.googleId = socialSignup.isGoogle ? socialSignup.decodedToken : undefined;
      newUser.appleId = socialSignup.isApple ? socialSignup.decodedToken : undefined;
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

  async createStore(body: CreateStoreDto) {
    const store = await StoreEntity.save(<StoreEntity>{
      name: body ? body.name ? body.name : 'string' : 'string',
    });

    CompanySettingEntity.save(<CompanySettingEntity>{ storeId: store.id })

    AppointmentSettingEntity.save(<AppointmentSettingEntity>{ storeId: store.id })

    StoreSettingEntity.save(<StoreSettingEntity>{ storeId: store.id })

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

  async newStore(store: CreateCompanyDto) {
    let _store = store as StoreEntity;
    _store.isActive = false;
    return StoreEntity.save(_store);
  }

  async updateCompany(storeId: number, updatecompany: CreateStoreDto) {
    let store = updatecompany as StoreEntity;
    store.id = storeId;
    return StoreEntity.save(store);
  }

  getConfirmationCode() {
    return crypto.randomBytes(10).toString('hex')
  }



}
