# Stripe Payment Integration dengan Appwrite

## Setup Instructions

### 1. Stripe Setup

1. Buat akun di [Stripe Dashboard](https://dashboard.stripe.com/)
2. Dapatkan API keys dari dashboard:
   - **Publishable key** (pk*test*...) untuk frontend
   - **Secret key** (sk*test*...) untuk backend
3. Update file `.env` dengan Stripe keys Anda

### 2. Appwrite Setup

1. Buat project di [Appwrite Console](https://cloud.appwrite.io/)
2. Buat database dan collection untuk bookings dengan schema:
   ```json
   {
     "booking_id": "integer",
     "user_id": "integer",
     "movie_id": "integer",
     "movie_title": "string",
     "time": "string",
     "date": "string",
     "tickets": "integer",
     "seats": "string",
     "total_amount": "double",
     "payment_status": "string",
     "payment_intent_id": "string",
     "created_at": "datetime"
   }
   ```
3. Update environment variables dengan Appwrite credentials

### 3. Environment Variables

Update file `.env` dengan values yang sesuai:

```env
# Appwrite
VITE_APPWRITE_DATABASE_ID=your_actual_database_id
VITE_APPWRITE_BOOKING_COLLECTION_ID=your_actual_collection_id
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_actual_project_id

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_your_actual_publishable_key
```

### 4. Testing Payment Flow

Untuk testing, gunakan Stripe test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Authentication Required**: 4000 0025 0000 3155

### 5. Production Setup (Opsional)

Untuk production yang lebih aman, deploy Appwrite Function:

1. Install Appwrite CLI:

   ```bash
   npm install -g appwrite-cli
   ```

2. Login dan init:

   ```bash
   appwrite login
   appwrite init function
   ```

3. Deploy function:
   ```bash
   appwrite deploy function
   ```

## Arsitektur Payment Flow

```
Frontend (React) -> Stripe Elements -> Appwrite Function -> Stripe API -> Appwrite Database
```

### Current Implementation (Demo)

- Frontend langsung simulasi payment
- Data disimpan ke Appwrite setelah "payment berhasil"
- Cocok untuk development dan testing

### Production Implementation

- Frontend kirim data ke Appwrite Function
- Function membuat Payment Intent di Stripe
- Frontend konfirmasi payment dengan Stripe
- Webhook update status di database
- Lebih aman dan sesuai best practices

## Files Structure

```
src/
├── components/
│   ├── PaymentForm.jsx       # Form pembayaran
│   └── PaymentForm.css       # Styling payment form
├── lib/
│   └── stripe.js            # Stripe integration utilities
└── pages/
    └── SeatsPage/
        └── index.jsx        # Updated dengan payment flow
```

## Next Steps

1. Setup Stripe webhook untuk production
2. Implement proper error handling
3. Add loading states dan feedback
4. Integrate dengan user authentication
5. Add receipt/invoice generation
