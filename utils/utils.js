const snakeToCamelCase = s => s.split('_').map((w, i) => i ? w.replace(/^[a-z]/, l => l.toUpperCase()) : w).join('');

const objectKeysSnakeToCamelCaseMaker = (object) => {
    const keys = Object.keys(object).map(snakeToCamelCase);
    const values = Object.values(object);

    const camelCaseObject = {};
    keys.forEach((key, index) => {
        camelCaseObject[key] = values[index];
    });

    return camelCaseObject;
};

exports.userDtoMaker = userDtoMaker = (user) => {
    // filter privat properties
    const {password, email, refresh_token, activation_link, ...userDto} = user;

    const camelCaseUserDto = objectKeysSnakeToCamelCaseMaker(userDto);

    return camelCaseUserDto;
};

exports.dtoMessageMaker = (messageArr) => {


    const camelCaseMessageArrDto = messageArr.map(objectKeysSnakeToCamelCaseMaker);

    return JSON.stringify(camelCaseMessageArrDto);
};