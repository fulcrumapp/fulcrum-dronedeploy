//export const server = 'https://api.fulcrumapp.com/';
export const server = 'https://c13dc5da.ngrok.io/';

const lastSlashIndex = window.location.pathname.lastIndexOf('/');

export const urlRoot = window.location.pathname.slice(0, lastSlashIndex);

export const tokenKey = 'fulcrum_token';
