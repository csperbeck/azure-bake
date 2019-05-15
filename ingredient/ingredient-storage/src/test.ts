import * as assert from 'assert';
import * as mc from "mocha"
import * as ch from "chai"
import { StorageUtils } from './functions'
import { StoragePlugIn } from './plugin'

mc.describe('Create Resource Name', function () {
    ch.it('Create Name Returns String', (done: mc.MochaDone) => {
        let storage = new StorageUtils()
        let results = StorageUtils.create_resource_name
        console.log("Name Results: " + results)      
        ch.assert(results && results == typeof string, "Name creation should return a string with the")
      done()
    });
  });