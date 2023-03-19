

const snakeToCamelCase = s => s.split('_').map((w, i) => i ? w.replace(/^[a-z]/, l => l.toUpperCase()) : w).join('');

export const userDtoMaker = (user) => {
    // filter privat properties
    const {password, email, refresh_token, activation_link, ...userDto} = user;

    // change keys in camelCase
    const keys = Object.keys(userDto).map(snakeToCamelCase);
    const values = Object.values(userDto);

    const camelCaseUserDto = {};
    keys.forEach((key, index) => {
        camelCaseUserDto[key] = values[index];
    });

    return camelCaseUserDto;
};