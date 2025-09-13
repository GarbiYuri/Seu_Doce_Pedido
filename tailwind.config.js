import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
  extend: {
    
  keyframes: {
    float: {
      '0%,100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  },
  animation: {
    float: 'float 5s ease-in-out infinite',
  },

    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    colors: {
      primary: '#613d20'
    }

},

    plugins: [forms],
   
}
};

  
