import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./auth.guard";
import { ApiOperation } from "@nestjs/swagger";

@Public()
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("signup")
	@ApiOperation({
		summary: "Register a new user",
	})
	signUp(@Body() signupDto: SignUpDto) {
		return this.authService.signUp(signupDto);
	}

	@Post("login")
	@ApiOperation({
		summary: "Log in and get an access token",
	})
	signin(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
