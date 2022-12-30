import cv from "~/composables/console/cv"
export default (...args) => {
    args.push('fromAPI')
    cv(...args)
}