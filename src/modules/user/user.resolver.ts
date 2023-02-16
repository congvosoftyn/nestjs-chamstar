import { Headers, UsePipes, ValidationPipe, UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserEntity } from "src/entities/User.entity";
import { UserService } from "./user.service";
import { FirebaseAuthInput } from "./dto/firebase-auth.input";
import { FirebaseAuthDto } from "./dto/firebase-auth.dto";
import { PostDataInput } from "./dto/PostData.input";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { User } from "./decorators/user.decorator";
import { FindUsersInput } from "./dto/FindUsers.input";
import { CreateUserInput } from "./dto/createUser.input";
import { CreateAccountInput } from "./dto/create-account.input";
import { UpdateMyUserInput } from "./dto/UpdateMyUser.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { LoginInput } from "./dto/login.input";

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private userService: UserService) { }

    @Query(() => UserEntity, { name: 'login' })
    async login(@Args('loginInput') loginInput: LoginInput) {
        return this.userService.login(loginInput);
    }

    @Mutation(() => UserEntity, { name: 'fblogin' })
    fbLogin(@Args('body') body: FirebaseAuthInput, @Headers('authorization') idToken: string,) {
        return this.userService.socialLogin(body as FirebaseAuthDto, { idToken, isFacebook: true });
    }

    @Mutation(() => UserEntity, { name: 'gglogin' })
    gglogin(@Args('body') body: FirebaseAuthInput, @Headers('authorization') idToken: string,) {
        return this.userService.socialLogin(body as FirebaseAuthDto, { idToken, isGoogle: true });
    }

    @Mutation(() => UserEntity, { name: 'applelogin' })
    applelogin(@Args('body') body: FirebaseAuthInput, @Headers('authorization') idToken: string,) {
        return this.userService.socialLogin(body as FirebaseAuthDto, { idToken, isApple: true });
    }

    // @Query(() => UserEntity, { name: 'logout' })
    // logout(@Args('refreshToken', { type: () => String }) refreshToken: string) {
    //     return this.userService.logout(refreshToken);
    // }

    @Mutation(() => UserEntity, { name: 'refreshToken' })
    @UsePipes(new ValidationPipe())
    refreshToken(@Args('_postData') _postData: PostDataInput) {
        return this.userService.refreshToken(_postData);
    }

  
    @Query(() => UserEntity, { name: 'user_UserId' })
    @UseGuards(JwtAuthenticationGuard)
    async getUserByID(@Args('UserId', { type: () => Int }) UserId: number) {
        return this.userService.getUserByID(UserId);
    }

  
    @Query(() => UserEntity, { name: 'findUsers' })
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    async findUsers(@Args('_findUsers') _findUsers: FindUsersInput, @User('companyId') companyId: number,) {
        return this.userService.findUsers(_findUsers, companyId);
    }

  
    @Query(() => UserEntity, { name: 'me' })
    @UseGuards(JwtAuthenticationGuard)
    async myUser(@User('userId') userId: number) {
        return this.userService.myUser(userId);
    }

  
    @Query(() => UserEntity, { name: 'forgot' })
    @UseGuards(JwtAuthenticationGuard)
    async forgotPassword(@Args('email', { type: () => String }) email: string) {
        return this.userService.forgotPassword(email);
    }

    @Query(() => UserEntity, { name: 'checkUsername' })
    async checkUsername(@Args('email', { type: () => String }) email: string) {
        return this.userService.checkUsername(email);
    }

    @Query(() => UserEntity, { name: 'code_again' })
    async sendVerifyEmailAgain(@Args('email', { type: () => String }) email: string) {
        return this.userService.sendVerifyEmailAgain(email);
    }

    @Mutation(() => UserEntity, { name: 'register' })
    @UsePipes(new ValidationPipe())
    async createUser(@Args('_user') _user: CreateUserInput) {
        return this.userService.createUser(_user);
    }

    @Mutation(() => UserEntity, { name: 'signup' })
    @UsePipes(new ValidationPipe())
    async createAccount(@Args('_user') _user: CreateAccountInput) {
        return await this.userService.createAccount(_user);
    }

    @Mutation(() => UserEntity, { name: 'verify' })
    @UsePipes(new ValidationPipe())
    async verifyEmail(@Args('code', { type: () => String }) code: string, @Args('email', { type: () => String }) email: string) {
        return await this.userService.verifyEmail(code, email);
    }
  
    @Mutation(() => UserEntity, { name: 'me' })
    @UseGuards(JwtAuthenticationGuard)
    async updateMyUser(@Args('profile') profile: UpdateMyUserInput) {
        return this.userService.updateMyUser(profile);
    }

  
    @Mutation(() => UserEntity, { name: 'update' })
    async updateUser(@Args('updateUser') updateUser: UpdateUserInput, @User('companyId') companyId: number,) {
        return this.userService.updateUser(updateUser as UserEntity, companyId);
    }

  
    @Mutation(() => UserEntity, { name: 'me' })
    @UseGuards(JwtAuthenticationGuard)
    async deleteUser(@Args('userId', { type: () => Int }) userId: number) {
        return this.userService.deleteUser(userId);
    }
}