export default {
  plugins: {
    "@tailwindcss/postcss": {
      // Configure Tailwind to scan the entire monorepo for classes
      base: "../../",
    },
  },
};
