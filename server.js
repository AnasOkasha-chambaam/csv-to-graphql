import {} from "@shopify/shopify-api/adapters/node";
import express from "express";
import fetch from "node-fetch";
import Color from "color";

let requestsArray = [],
  fetchingHandler;
class FetchingBigReqNumbers {
  constructor(maxRequestsNumber, arr) {
    this.iteratorValue = 0;
    this.maxRequestsNumber =
      maxRequestsNumber > arr.length ? arr.length : maxRequestsNumber;
    this.arr = arr;
    this.finished = false;
  }

  runIterator() {
    for (
      ;
      this.iterator < this.maxRequestsNumber && !this.finished;
      this.iterator += 1
    ) {
      // console.log(this.iterator);
    }
  }

  get iterator() {
    return this.iteratorValue;
  }
  set iterator(value) {
    if (value > this.arr.length) {
      this.finished = true;
      console.log(this.arr.length + " request finished!");
      return;
    }
    this.iteratorValue = value;
    let promise = new Promise(async (res, rej, reason) => {
      await deletFromShopifyStore(this.arr[this.iteratorValue - 1]);
      res();
    });
    promise.then(() => {
      setTimeout(() => {}, Math.floor(Math.random() * 500));
      this.iterator = this.iterator + 1;
      //   console.log(this.iteratorValue);
    });
  }
}

// For Reading CSV
import fs from "fs";
import { parse } from "csv";

function readCSVFile() {
  fs.createReadStream("./CSV File/any.csv")
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", async function (row) {
      requestsArray.push(row[0]);
      // console.log("Id:", row[0]);
    })
    .on("end", function () {
      console.log("Parsing Finished");
      runDeletingProcess(requestsArray);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}

function runDeletingProcess(array) {
  fetchingHandler = new FetchingBigReqNumbers(10, array);
  fetchingHandler.runIterator();
}

async function deletFromShopifyStore(handle) {
  const getProductId = await fetch(
      "https://freelancing-project.myshopify.com/admin/api/2022-10/graphql.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          "X-Shopify-Access-Token": "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",
        },
        body: `query {
          productByHandle(handle: "${handle}") {
            id
            handle
          }
        }`,
      }
    ),
    data = await getProductId.json();
  let { productByHandle } = data.data;
  let id = "Not Found";
  console.log(data.data);
  if (productByHandle && productByHandle !== null && productByHandle.id) {
    id = productByHandle.id;
    const resp = await fetch(
        "https://freelancing-project.myshopify.com/admin/api/2022-10/graphql.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/graphql",
            "X-Shopify-Access-Token": "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",
          },
          body: `mutation {
            productDelete(input: {id: "${id}"}) {
              deletedProductId
              userErrors {
                field
                message
              }
            }
          }`,
        }
      ),
      response = await resp.json();
    console.log();
    console.log("from delete function:", JSON.stringify(response));
    console.log();
    return response;
  }
  console.log("Id:", id, " ; ", "Handle:", handle);
}

const app = express();

readCSVFile();
