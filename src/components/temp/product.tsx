export async function ProductComponent() {
    await new Promise(r => setTimeout(r, 2000))
    return <div>Product Details</div>
}