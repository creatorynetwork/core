import { Transactions } from "@arkecosystem/crypto";
import { Utils } from "@arkecosystem/crypto";
import ByteBuffer from "bytebuffer";
import { IBridgechainResignationAsset } from "../interfaces";
import {
    MarketplaceTransactionGroup,
    MarketplaceTransactionStaticFees,
    MarketplaceTransactionType,
} from "../marketplace-transactions";

const { schemas } = Transactions;

const bridgechainResignationType: number = MarketplaceTransactionType.BridgechainResignation;

export class BridgechainResignationTransaction extends Transactions.Transaction {
    public static typeGroup: number = MarketplaceTransactionGroup;
    public static type = bridgechainResignationType;
    public static key: string = "bridgechainResignation";

    public static getSchema(): Transactions.schemas.TransactionSchema {
        return schemas.extend(schemas.transactionBaseSchema, {
            $id: "bridgechainResignation",
            properties: {
                type: { transactionType: bridgechainResignationType },
                amount: { bignumber: { minimum: 0, maximum: 0 } },
                asset: {
                    type: "object",
                    required: ["bridgechainResignation"],
                    properties: {
                        bridgechainResignation: {
                            type: "object",
                            required: ["bridgechainId"],
                            properties: {
                                bridgechainId: { bignumber: { minimum: 1 } },
                            },
                        },
                    },
                },
            },
        });
    }
    protected static defaultStaticFee = Utils.BigNumber.make(MarketplaceTransactionStaticFees.BridgechainResignation);

    public serialize(): ByteBuffer {
        const { data } = this;

        const bridgechainResignationAsset = data.asset.bridgechainResignation as IBridgechainResignationAsset;
        const buffer: ByteBuffer = new ByteBuffer(8, true);
        buffer.writeUint64(+bridgechainResignationAsset.bridgechainId);
        return buffer;
    }

    public deserialize(buf: ByteBuffer): void {
        const { data } = this;

        const bridgechainId: Utils.BigNumber = Utils.BigNumber.make(buf.readUint64().toString());
        data.asset = {
            bridgechainResignation: {
                bridgechainId,
            },
        };
    }
}
