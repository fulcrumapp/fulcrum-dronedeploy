export const server = 'https://api.fulcrumapp.com/';

const lastSlashIndex = window.location.pathname.lastIndexOf('/');

export const urlRoot = window.location.pathname.slice(0, lastSlashIndex);
