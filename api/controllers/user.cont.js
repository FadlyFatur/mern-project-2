export const test = (req, res) => {
    res.status(200).json({
        statusCode:200,
        message: "API users is connected!"
    });
};