export const userDtoMaker = (user) => {
    const {password, email, activation_link, refresh_token, is_activated,   ...rest} = user;
    return rest;
};