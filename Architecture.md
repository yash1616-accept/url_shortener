# Brua URL Shortener: System Architecture

*Use this diagram during your interviews to visually explain the data flow, caching strategy, and asynchronous analytics pipeline of your application.*

```mermaid
graph TD
    %% Styling
    classDef user fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    classDef network fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef backend fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef db fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef external fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    
    %% Actors
    User((End User)):::user
    Marketer((Marketer / Customer)):::user
    
    %% URL Resolution Flow
    subgraph "High-Speed Redirection Flow"
        User -->|1. Clicks Short URL| Vercel[Vercel Global Edge Network]:::network
        Vercel -->|2. Route Request| API[Next.js Serverless Route]:::backend
        
        API -->|3. Read Request| Redis[(Upstash Redis Cache)]:::db
        
        Redis -- "Cache Hit (< 10ms)" --> Response[HTTP 302 Redirect]:::network
        Redis -- "Cache Miss" --> Mongo[(MongoDB Atlas Primary)]:::db
        
        Mongo -->|Fetch URL| API
        API -->|Write-Through Update| Redis
        API --> Response
        
        Response -.->|Redirects to| Destination(Destination Website)
    end
    
    %% Analytics Flow
    subgraph "Asynchronous Event Pipeline"
        Response -->|4. Async Trigger| Events[Background Event Processor]:::backend
        
        Events -->|Update Metrics| Mongo
        Events -->|Push Server-Side Event| GA4(Google Analytics 4):::external
        Events -->|Fire POST Payload| Webhook(Customer's Internal CRM):::external
    end
    
    %% Dashboard Flow
    subgraph "Management & Reporting"
        Marketer -->|Authentication| Clerk[Clerk B2B Auth]:::external
        Clerk -->|Validated Session| Dashboard[Next.js Dashboard UI]:::backend
        Dashboard -->|Fetch Aggregated Data| Mongo
    end
```

## How to Explain This Diagram

When an interviewer asks how the system works, break it down into these three sections:

### 1. High-Speed Redirection Flow (The Core)
> "When a user clicks a short link, the request hits Vercel's Edge Network. To achieve sub-10ms global redirects, the Next.js Serverless function immediately queries **Upstash Redis**. If it's a Cache Hit, we redirect the user instantly. If it's a Cache Miss, we query **MongoDB**, execute a Write-Through back to Redis so the next click is fast, and then redirect the user."

### 2. Asynchronous Event Pipeline (The Analytics)
> "Redirecting the user is priority #1, so analytics are processed *asynchronously* so they never slow down the redirect. Once the redirect fires, a background process updates the click count and geographic metrics in **MongoDB**, pushes a server-side event to **Google Analytics 4 (GA4)** via the Measurement Protocol, and fires a real-time **Webhook** payload to the customer's CRM."

### 3. Management & Reporting (The B2B SaaS Layer)
> "For the marketing teams using the product, all authentication and multi-tenant workspace isolation is handled by **Clerk**. Once authenticated, they access the Next.js Dashboard which fetches real-time aggregated metrics directly from MongoDB."
