// Or async function
module.exports = async () => {
  return {
    verbose: true,
    collectCoverage: true,
    testMatch: ["**/bin/**/*.test.js"],
    rootDir: __dirname,
    reporters: [
      "default",
      [
        "jest-html-reporters",
        {
          publicPath: "./bin/",
          filename: "report.html",
          expand: true,
        },
      ],
    ],
  };
};
