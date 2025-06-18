import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

type User = {
    email: string;
    verificationCode: string;
    verificationCodeExpiresAt: Date;
}

async function main() {
 const verCode_and_expiresAt = await prisma.user.findUnique({
		where: {
			email: "cjakesupnet@gmail.om",
		},
})

    console.log(verCode_and_expiresAt);

    if (verCode_and_expiresAt) {
        const { verificationCode, verificationCodeExpiresAt } = verCode_and_expiresAt;
        console.log("Verification Code:", verificationCode);
        console.log("Verification Code Expires At:", verificationCodeExpiresAt);
        // You can use verificationCode and verificationCodeExpiresAt here
    } else {
        console.log("User not found.");
    }
}

main();