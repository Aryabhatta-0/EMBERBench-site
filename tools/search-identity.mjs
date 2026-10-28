// Google site names: https://developers.google.com/search/docs/appearance/site-names
// Organization identity: https://developers.google.com/search/docs/appearance/structured-data/organization
export const searchIdentity=Object.freeze({name:'Anantam',alternateName:'Anantam Labs',profile:'https://github.com/Aryabhatta-0'});

// This public verification value must come from the owner's Search Console.
// Never invent it, substitute an account credential, or accept executable markup.
export function verificationMeta(config){
 if(!config||typeof config!=='object'||Array.isArray(config)||Object.keys(config).join('|')!=='google_site_verification')throw Error('Unexpected search verification configuration');
 const token=config.google_site_verification;
 if(token===null)return '';
 if(typeof token!=='string'||!/^[-_A-Za-z0-9]{10,256}$/.test(token))throw Error('Invalid owner-issued Google verification value');
 return `<meta name="google-site-verification" content="${token}">`;
}
