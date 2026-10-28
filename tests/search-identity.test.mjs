import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verificationMeta,verificationFile} from '../tools/search-identity.mjs';

test('Google verification is absent until the owner supplies a value',()=>{
 assert.equal(verificationMeta({google_site_verification:null}),'');
});
test('an owner-issued public value renders one static verification meta tag',()=>{
 assert.equal(verificationMeta({google_site_verification:'SYNTHETIC_test-value_123456'}),'<meta name="google-site-verification" content="SYNTHETIC_test-value_123456">');
});
test('verification config rejects executable markup and unexpected fields',()=>{
 for(const value of [undefined,{},[],{google_site_verification:null,extra:true},{google_site_verification:'"><script>alert(1)</script>'},{google_site_verification:'too-short'}])assert.throws(()=>verificationMeta(value));
});
test('HTML-file verification preserves the supplied filename and exact body without a fake meta token',()=>{
 const config={google_site_verification:null,google_verification_file:'googleca4565681d2b6fc3.html'};
 assert.deepEqual(verificationFile(config),{file:config.google_verification_file,content:'google-site-verification: googleca4565681d2b6fc3.html'});
 assert.equal(verificationMeta(config),'');
 assert.equal(verificationFile({google_site_verification:null}),null);
});
test('HTML-file verification cannot select another path or inject content',()=>{
 for(const file of ['../googleca4565681d2b6fc3.html','index.html','googleca4565681d2b6fc3.html<script>','data/results.js'])assert.throws(()=>verificationFile({google_site_verification:null,google_verification_file:file}));
});
