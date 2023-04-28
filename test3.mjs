var emails = ["prettyandsimple@example.com", //1
    "very.common@example.com", //2
    "disposable.style.email.with+symbol@example.com", //3
    "other.email-with-dash@example.com", //4
    "fully-qualified-domain@example.com", //5
    "x@example.com", //6
    "\"very.unusual.@.unusual.com\"@example.com", //7
    "\"very. (),:;<> []\\\".VERY.\\\"very@\\ \\\"very\\\".unusual\"@strange.example.com", //8
    "admin@mailserver1", //9
    "user%example.com@example.org", //10
    "user.name+tag+sorting@example.com", //11
    "test/test@test.com", //12
    "_______@example.com", //13
    "firstname-lastname@example.com", //14
    "1234567890@example.com", //15
    "email@subdomain.example.com", //16
    "email@[123.123.123.123]", //17
    "\"email\"@example.com", //18
    "email@-example.com", //19
    "email@[IPv6:2001:db8::1]"]; //20

const emailfilter3 = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const emailfilter4 = /^\S+@\S+\.(\S{2,})$/

emails.forEach(mail => {
    console.log(`${mail} - ${emailfilter4.test(mail)}`)
})