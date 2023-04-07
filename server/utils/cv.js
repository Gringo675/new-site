import cv from "/pr_gt/projects/site/composables/console/cv" // нашел только такой рабочий вариант. Возможно в будущих версиях поправят.

export default (...args) => {
    args.push('fromAPI')
    cv(...args)
}