import { gql } from '@apollo/client';

export const itemsForSaleQuery = gql`
    query itemsForSale($itemsForSaleInput: ItemsForSaleInput) {
      itemsForSale(input: $itemsForSaleInput) {
        _id
        for_sale
        img_urls
        tags
        countries {
          col {
            price
            ccy
            available {
              red {
                s
                m
                l
                t
              }
              black {
                s
                m
                l
                t
              }
            }
          }
          usa {
            price
            ccy
            available {
              red {
                s
                m
                l
                t
              }
              black {
                s
                m
                l
                t
              }
            }
          }
        }
        times_acquired {
          col {
            red {
              s
              m
              l
              t
            }
            black {
              s
              m
              l
              t
            }
          }
          usa {
            red {
              s
              m
              l
              t
            }
            black {
              s
              m
              l
              t
            }
          }
        }
      }
    }`