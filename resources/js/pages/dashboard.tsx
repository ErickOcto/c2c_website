import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, Clock, CheckCircle2, XCircle } from "lucide-react"
import type { Product, ProductImage } from "@/types/product"
import { formatRp } from "@/lib/utils"

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: string
  product: Product
}

export interface Order {
  id: number
  transaction_id: number
  seller_id: number
  total_price: string
  shipping_courier: string
  shipping_service: string
  shipping_cost: string
  shipping_etd: string | null
  status: 'pending' | 'processed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  seller: { id: number; name: string }
}

export interface Transaction {
  id: number
  buyer_id: number
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'expire' | 'cancel'
  gross_amount: string
  created_at: string
  orders: Order[]
}

export default function Dashboard({ transactions = [] }: { transactions: Transaction[] }) {

  const getPaymentStatusBadge = (status: Transaction['payment_status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
      case 'failed':
      case 'expire':
      case 'cancel':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOrderStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'processed': return <Package className="w-4 h-4 text-blue-500" />
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Delivered</Badge>
      case 'shipped':
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">Shipped</Badge>
      case 'processed':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Processed</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Cancelled</Badge>
      case 'pending':
      default:
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 max-w-4xl mx-auto w-full px-4">
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
            <p className="text-muted-foreground mt-2">Track, manage, and review your recent orders.</p>
          </div>

          <div className="flex flex-col gap-6">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-card border-dashed">
                <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No purchases yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  You haven't placed any orders. Start browsing the marketplace to find something you like!
                </p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden shadow-sm">
                  {/* Transaction Header */}
                  <div className="bg-muted/40 border-b px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground">
                          Order Date: {new Date(transaction.created_at).toLocaleDateString()}
                        </span>
                        {getPaymentStatusBadge(transaction.payment_status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Transaction ID: TXN-{transaction.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-base font-bold">{formatRp(Number(transaction.gross_amount))}</p>
                    </div>
                  </div>

                  {/* Orders Within Transaction */}
                  <div className="divide-y">
                    {transaction.orders.map((order) => (
                      <div key={order.id} className="p-6">
                        {/* Seller & Status */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">Seller: {order.seller.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getOrderStatusIcon(order.status)}
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                              <div className="h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0 border relative">
                                {item.product.images?.[0] ? (
                                  <img 
                                    src={`/storage/${item.product.images[0].image_url}`} 
                                    alt={item.product.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">
                                    No Image
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium line-clamp-2">{item.product.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{item.quantity} x {formatRp(Number(item.price))}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-medium">{formatRp(Number(item.price) * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Info Footer */}
                        <div className="mt-6 p-4 rounded-md bg-secondary/30 flex items-center justify-between text-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5" /> Shipping Courier
                            </span>
                            <span className="font-medium">
                              {order.shipping_courier.toUpperCase()} - {order.shipping_service}
                            </span>
                          </div>
                          <div className="text-right flex flex-col gap-1">
                            <span className="text-muted-foreground">Shipping Cost</span>
                            <span className="font-medium">{formatRp(Number(order.shipping_cost))}</span>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
