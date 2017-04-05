// export const server = 'http://localhost:3000/';
// export const server = 'https://457bc7ad.ngrok.io/';
export const server = 'https://api.fulcrumapp.com/';

const lastSlashIndex = window.location.pathname.lastIndexOf('/');

export const urlRoot = window.location.pathname.slice(0, lastSlashIndex);
