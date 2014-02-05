package bg.infologica.water.orm;

import java.sql.Timestamp;

/**
 * Created by Nikola on 14-2-5.
 */
public class OrderItemsOrm {
    private int orderId;
    private int orderItemId;
    private float quantity;
    private String remark;
    private Timestamp date;
    private Item item;

    public OrderItemsOrm(int orderId,int orderItemId, float quantity, String remark, Timestamp date, Item item) {
        this.orderItemId = orderItemId;
        this.orderId = orderId;
        this.quantity = quantity;
        this.remark = remark;
        this.date = date;
        this.item = item;
    }

    public OrderItemsOrm() {

    }

    public int getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(int orderItemId) {
        this.orderItemId = orderItemId;
    }

    public float getQuantity() {
        return quantity;
    }

    public void setQuantity(float quantity) {
        this.quantity = quantity;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }
}
