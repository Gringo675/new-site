export default (req, res) => {
    console.log(`req: ${req.url}`);
    return `req.url: ${req.url}`
}