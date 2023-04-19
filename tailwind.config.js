module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      'white': {
        100: '#FCFCFC',   
      },                     
      'lime': {
        100: '#D2FA00',
      },
      'blue': {
        100: '#246BFD',
      },
      'stone': {
        100: '#181A20',
        200: '#161130',
      },
      'gray': {
        100: '#2D3039',
      },
      'orange':{
        100:'#45B4059',
      }
    }, 

    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
