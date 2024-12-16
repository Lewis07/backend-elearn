import { LOGO } from 'src/main';
import { User } from 'src/modules/users/schemas/user.schema';

export const resetPasswordTemplate = (
  user: User,
  forgotPasswordLink: string,
) => {
  return `
        <!DOCTYPE html>
            <html>
                <head>
                    <style> 
                      .greeting {
                        color: gray;
                        font-weight: bold;
                      }
                    </style>
                </head>
                <body>
                    <img src="${LOGO}" width="100" height="100" />
                    <p><span class="greeting">Hello</span> ${user.usr_username},</p>
                    <p>To reset your password, click on this link <a href=${forgotPasswordLink}>${forgotPasswordLink}</a></p>
                </body>
            </html>
    `;
};
