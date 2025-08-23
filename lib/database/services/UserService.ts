import { Repository } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { User } from '../entities/User';
import { hash, compare } from 'bcrypt';

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    // 사용자 생성
    async createUser(userData: {
        email: string;
        password: string;
        name?: string;
    }): Promise<User> {
        const hashedPassword = await hash(userData.password, 12);

        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });

        return await this.userRepository.save(user);
    }

    // 이메일로 사용자 찾기
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    // ID로 사용자 찾기
    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    // 비밀번호 검증
    async validatePassword(user: User, password: string): Promise<boolean> {
        return await compare(password, user.password);
    }

    // 사용자 정보 업데이트
    async updateUser(id: number, updateData: Partial<User>): Promise<User | null> {
        await this.userRepository.update(id, updateData);
        return await this.findById(id);
    }

    // 비밀번호 변경
    async changePassword(id: number, newPassword: string): Promise<void> {
        const hashedPassword = await hash(newPassword, 12);
        await this.userRepository.update(id, { password: hashedPassword });
    }

    // 이메일 인증 토큰 설정
    async setVerificationToken(email: string, token: string): Promise<void> {
        await this.userRepository.update(
            { email },
            { verificationToken: token }
        );
    }

    // 이메일 인증
    async verifyEmail(token: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { verificationToken: token }
        });

        if (!user) return false;

        await this.userRepository.update(user.id, {
            isVerified: true,
            verificationToken: null
        });

        return true;
    }

    // 비밀번호 재설정 토큰 설정
    async setResetPasswordToken(email: string, token: string, expires: Date): Promise<void> {
        await this.userRepository.update(
            { email },
            {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        );
    }

    // 비밀번호 재설정 토큰 검증
    async validateResetToken(token: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: new Date() // 만료되지 않은 토큰만
            }
        });
    }

    // 비밀번호 재설정
    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        const user = await this.validateResetToken(token);
        if (!user) return false;

        const hashedPassword = await hash(newPassword, 12);
        await this.userRepository.update(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        return true;
    }

    // 사용자 삭제
    async deleteUser(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
