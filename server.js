import {} from "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import express from "express";
import fetch from "node-fetch";
import Color from "color";
const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: "3030031a4a9c49753dd716f8578b7d7a",
  apiSecretKey: "186815e4d14ab2fff6aa5bc0b6b7a8cd",
  scopes: `
  read_analytics, write_assigned_fulfillment_orders, read_assigned_fulfillment_orders, read_customer_events, read_content_entries, write_content_models, read_content_models, write_content_entries, write_custom_pixels, read_custom_pixels, write_customers, read_customers, write_discounts, read_discounts, read_discovery, write_discovery, write_draft_orders, read_draft_orders, write_files, read_files, write_fulfillments, read_fulfillments, read_gdpr_data_request, write_inventory, read_inventory, write_gift_cards, read_gift_cards, write_locations, read_locations, write_legal_policies, read_legal_policies, write_marketing_events, read_marketing_events, write_merchant_managed_fulfillment_orders, read_merchant_managed_fulfillment_orders, read_online_store_navigation, write_online_store_pages, read_online_store_pages, write_order_edits, read_order_edits, write_orders, read_orders, write_payment_terms, read_payment_terms, write_pixels, read_pixels, write_price_rules, read_price_rules, write_product_feeds, read_product_feeds, write_product_listings, read_product_listings, write_products, read_products, write_publications, read_publications, write_purchase_options, read_purchase_options, write_reports, read_reports, write_resource_feedbacks, read_resource_feedbacks, write_third_party_fulfillment_orders, read_third_party_fulfillment_orders, write_translations, read_translations`.split(
    ","
  ),
  hostName: "ngrok-tu   nnel-address",
});
// For Reading CSV
import fs from "fs";
import { parse } from "csv";

function readCSVFile() {
  fs.createReadStream("./CSV File/any.csv")
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", async function (row) {
      await deletFromShopifyStore(row[0]);
      console.log("Id:", row[0]);
    })
    .on("end", function () {
      console.log("finished");
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}

async function deletFromShopifyStore(id) {
  //   const client = new shopify.clients.Graphql({ session });
  //   const response = await client.query({
  //     data: `{products(first: 3) {
  //         edges {
  //           node {
  //             id
  //             title
  //           }
  //         }
  //       }}`,
  //   });
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
}

const app = express();

readCSVFile();
