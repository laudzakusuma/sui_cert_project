module contract::certificate {
    use std::string::{Self, String};
    use sui::package;
    use sui::display;

    public struct CERTIFICATE has drop {}

    public struct Certificate has key, store {
        id: UID,
        title: String,
        recipient_name: String,
        image_blob_id: String,
        issuer: address,
    }

    fun init(otw: CERTIFICATE, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
        ];

        let values = vector[
            string::utf8(b"{title}"),
            string::utf8(b"Certificate for {recipient_name}"),
            string::utf8(b"https://aggregator.walrus-testnet.walrus.space/v1/{image_blob_id}")
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<Certificate>(&publisher, keys, values, ctx);

        display::update_version(&mut display);

        sui::transfer::public_transfer(publisher, ctx.sender());
        sui::transfer::public_transfer(display, ctx.sender());
    }

    public fun mint_to_student(
        title: vector<u8>,
        recipient_name: vector<u8>,
        blob_id: vector<u8>,
        recipient_address: address,
        ctx: &mut TxContext
    ) {
        let cert = Certificate {
            id: object::new(ctx),
            title: string::utf8(title),
            recipient_name: string::utf8(recipient_name),
            image_blob_id: string::utf8(blob_id),
            issuer: ctx.sender(),
        };

        sui::transfer::public_transfer(cert, recipient_address);
    }
}