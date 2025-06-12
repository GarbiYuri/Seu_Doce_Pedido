<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


class MercadoPagoController extends Controller
{

    public function config(){
        MercadoPagoConfig::setAccessToken("ACCESS_TOKEN");
        $client = new PreferenceClient();
        $preference = $client->create([
        "back_urls"=>array(
            "success" => "https://test.com/success",
            "failure" => "https://test.com/failure",
            "pending" => "https://test.com/pending"
        ),
        "differential_pricing" => array(
            "id" => 1,
        ),
        "expires" => false,
        "items" => array(
            array(
                "id" => "1234",
                "title" => "Dummy Title",
                "description" => "Dummy description",
                "picture_url" => "https://www.myapp.com/myimage.jpg",
                "category_id" => "car_electronics",
                "quantity" => 2,
                "currency_id" => "BRL",
                "unit_price" => 100
            )
        ),
        "marketplace_fee" => 0,
        "payer" => array(
            "name" => "Test",
            "surname" => "User",
            "email" => "your_test_email@example.com",
            "phone" => array(
                "area_code" => "11",
                "number" => "4444-4444"
            ),
            "identification" => array(
                "type" => "CPF",
                "number" => "19119119100"
            ),
            "address" => array(
                "zip_code" => "06233200",
                "street_name" => "Street",
                "street_number" => "123"
            )
        ),
        "additional_info" => "Discount: 12.00",
        "auto_return" => "all",
        "binary_mode" => true,
        "external_reference" => "1643827245",
        "marketplace" => "none",
        "notification_url" => "https://notificationurl.com",
        "operation_type" => "regular_payment",
        "payment_methods" => array(
            "default_payment_method_id" => "master",
            "excluded_payment_types" => array(
                array(
                    "id" => "visa"
                )
            ),
            "excluded_payment_methods" => array(
                array(
                    "id" => ""
                )
            ),
            "installments" => 5,
            "default_installments" => 1
        ),
        "shipments" >= array(
            "mode" => "custom",
            "local_pickup" => false,
            "default_shipping_method" => null,
            "free_methods" => array(
                array(
                    "id" => 1
                )
            ),
            "cost" => 10,
            "free_shipping" => false,
            "dimensions" => "10x10x20,500",
            "receiver_address" => array(
                "zip_code" => "06000000",
                "street_number" => "123",
                "street_name" => "Street",
                "floor" => "12",
                "apartment" => "120A",
                "city_name" => "Rio de Janeiro",
                "state_name" => "Rio de Janeiro",
                "country_name" => "Brasil"
            )
        ),
        "statement_descriptor" => "Test Store",
        ]);
        
        echo implode($preference);
    }

}
