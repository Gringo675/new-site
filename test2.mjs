
const validateEmail = (mail) => {
    // return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,20})+$/.test(mail)
    // return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,15}$/.test(mail)
    // const regexp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm
    // const regexp = /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
    // const regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return regexp.test(mail)
}

const mails = [
    'some@mail.ru',
    'some.mail',
    'some@mail',
    'sdd.e4332@marl.cs',
    'sdd.e4332@marl.css',
    'sdd.e4332@marl.csss',
    'sdd.es.dd4332@marl.csss',
    'sdd.e4332@marl.csssfdfd32ggggffghhgfhffghg.ruffsdfdsv',
    'sd-d.e43.32@marl.cs-ssfdfd.32ggggffghhgfhffghg.ruffsdfdsv',
    'sd-d.e43.32@marl.cs-ssfdfd.32ggggffghhgfhffghg.ruffsdfg.ftrdfgffdsdsdfbbvvga'
]

mails.forEach(mail => {
    console.log(`${mail}: ${validateEmail(mail)}`)
});