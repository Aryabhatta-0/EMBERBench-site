// Google site names: https://developers.google.com/search/docs/appearance/site-names
// Organization identity: https://developers.google.com/search/docs/appearance/structured-data/organization
export const searchIdentity=Object.freeze({name:'Anantam',alternateName:'Anantam Labs',profile:'https://github.com/Aryabhatta-0'});

// This public verification value must come from the owner's Search Console.
// Never invent it, substitute an account credential, or accept executable markup.
function validateConfig(config){
 if(!config||typeof config!=='object'||Array.isArray(config)||!Object.hasOwn(config,'google_site_verification')||Object.keys(config).some(key=>!['google_site_verification','google_verification_file'].includes(key)))throw Error('Unexpected search verification configuration');
 if(config.google_verification_file!=null&&(typeof config.google_verification_file!=='string'||!/^google[a-f0-9]{16}\.html$/.test(config.google_verification_file)))throw Error('Invalid owner-issued Google verification filename');
}
export function verificationMeta(config){
 validateConfig(config);
 const token=config.google_site_verification;
 if(token===null)return '';
 if(typeof token!=='string'||!/^[-_A-Za-z0-9]{10,256}$/.test(token))throw Error('Invalid owner-issued Google verification value');
 return `<meta name="google-site-verification" content="${token}">`;
}

// Owner-supplied HTML-file method; keep its exact plain-text body unmodified.
// https://developers.google.com/site-verification/v1/getting_started#verification
export function verificationFile(config){
 validateConfig(config);
 const file=config.google_verification_file;
 return file==null?null:{file,content:`google-site-verification: ${file}`};
}
