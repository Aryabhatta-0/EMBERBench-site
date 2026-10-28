import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verificationMeta} from '../tools/search-identity.mjs';

test('Google verification is absent until the owner supplies a value',()=>{
 assert.equal(verificationMeta({google_site_verification:null}),'');
});
test('an owner-issued public value renders one static verification meta tag',()=>{
 assert.equal(verificationMeta({google_site_verification:'SYNTHETIC_test-value_123456'}),'<meta name="google-site-verification" content="SYNTHETIC_test-value_123456">');
});
test('verification config rejects executable markup and unexpected fields',()=>{
 for(const value of [undefined,{},[],{google_site_verification:null,extra:true},{google_site_verification:'"><script>alert(1)</script>'},{google_site_verification:'too-short'}])assert.throws(()=>verificationMeta(value));
});
