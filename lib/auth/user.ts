import { UserData, UserWithPassword } from '@/lib/types/auth'

// 임시 사용자 저장소 (실제로는 데이터베이스를 사용해야 함)
const users: Map<string, UserWithPassword> = new Map()

/**
 * 이메일 주소로 사용자를 검색합니다.
 * 
 * @param {string} email - 검색할 사용자의 이메일 주소
 * @returns {Promise<UserWithPassword | null>} 찾은 사용자 정보(비밀번호 포함) 또는 null
 * @description 로그인 시 사용자 인증을 위해 비밀번호가 포함된 사용자 정보를 반환합니다.
 *              실제 운영 환경에서는 데이터베이스 쿼리로 대체해야 합니다.
 * 
 * @example
 * ```typescript
 * const user = await findUserByEmail('user@example.com')
 * if (user) {
 *   console.log(`사용자 찾음: ${user.name}`)
 * }
 * ```
 */
export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
    // 실제로는 데이터베이스 쿼리를 사용해야 함
    for (const user of users.values()) {
        if (user.email === email) {
            return user
        }
    }
    return null
}

/**
 * 사용자 ID로 사용자를 검색합니다.
 * 
 * @param {string} id - 검색할 사용자의 고유 ID
 * @returns {Promise<UserData | null>} 찾은 사용자 정보(비밀번호 제외) 또는 null
 * @description 사용자 프로필 조회 등에 사용되며, 보안상 비밀번호는 제외하고 반환합니다.
 * 
 * @example
 * ```typescript
 * const user = await findUserById('user-123')
 * if (user) {
 *   console.log(`사용자: ${user.name} (${user.email})`)
 * }
 * ```
 */
export async function findUserById(id: string): Promise<UserData | null> {
    const user = users.get(id)
    if (!user) return null

    // 비밀번호는 제외하고 반환
    const { password, ...userData } = user
    return userData
}

/**
 * 새로운 사용자를 생성하고 저장합니다.
 * 
 * @param {Omit<UserData, 'id'> & { password: string }} userData - 생성할 사용자 정보 (ID 제외, 비밀번호 포함)
 * @returns {Promise<UserData>} 생성된 사용자 정보 (비밀번호 제외)
 * @description 회원가입 시 새로운 사용자를 생성합니다. UUID를 사용하여 고유한 ID를 자동 생성합니다.
 *              반환 시에는 보안상 비밀번호를 제외합니다.
 * 
 * @example
 * ```typescript
 * const newUserData = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'hashedPassword123'
 * }
 * const user = await createUser(newUserData)
 * console.log(`새 사용자 생성: ${user.id}`)
 * ```
 */
export async function createUser(userData: Omit<UserData, 'id'> & { password: string }): Promise<UserData> {
    const id = crypto.randomUUID()
    const newUser = { ...userData, id }

    users.set(id, newUser)

    // 비밀번호는 제외하고 반환
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
}

/**
 * 입력된 비밀번호와 저장된 해시 비밀번호를 비교하여 검증합니다.
 * 
 * @param {string} password - 사용자가 입력한 평문 비밀번호
 * @param {string} hashedPassword - 데이터베이스에 저장된 해시된 비밀번호
 * @returns {Promise<boolean>} 비밀번호 일치 여부
 * @description 로그인 시 사용자가 입력한 비밀번호를 검증합니다.
 *              현재는 평문 비교이지만, 실제로는 bcrypt 등의 해시 라이브러리를 사용해야 합니다.
 * 
 * @example
 * ```typescript
 * const isValid = await verifyPassword('userPassword', 'hashedPassword')
 * if (isValid) {
 *   console.log('비밀번호가 일치합니다')
 * }
 * ```
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // 실제로는 bcrypt 등을 사용해야 함
    // 여기서는 간단히 평문 비교
    return password === hashedPassword
}

/**
 * 평문 비밀번호를 해시하여 안전하게 저장할 수 있는 형태로 변환합니다.
 * 
 * @param {string} password - 해시할 평문 비밀번호
 * @returns {Promise<string>} 해시된 비밀번호
 * @description 사용자 비밀번호를 데이터베이스에 저장하기 전에 해시 처리합니다.
 *              현재는 평문을 그대로 반환하지만, 실제로는 bcrypt 등의 해시 라이브러리를 사용해야 합니다.
 * 
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword('userPassword123')
 * console.log('해시된 비밀번호:', hashedPassword)
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
    // 실제로는 bcrypt 등을 사용해야 함
    // 여기서는 간단히 평문 반환
    return password
}
