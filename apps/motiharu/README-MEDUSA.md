# Motiharu - Multi-vendor Medusa Storefront

Ce projet est un storefront moderne pour Medusa avec support multi-vendeur, utilisant React 19, Vite, et HeroUI.

## Architecture

### Configuration des variables d'environnement

Les variables suivantes sont exposées via Vite dans `vite.config.ts` :

```typescript
define: {
  MEDUSA_BACKEND_URL: JSON.stringify(process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"),
  MEDUSA_PUBLISHABLE_KEY: JSON.stringify(process.env.MEDUSA_PUBLISHABLE_KEY || ""),
  MOTIHARU_SELLER_ID: JSON.stringify(process.env.MOTIHARU_SELLER_ID || ""),
}
```

### Client API Medusa

Le client Medusa (`src/lib/api/medusa-client.ts`) fournit :

- **Cache local** : Mise en cache automatique des réponses API avec TTL et éviction LRU
- **Support multi-vendeur** : Ajout automatique du header `seller_id` pour filtrer les produits
- **Gestion d'erreurs** : Gestion robuste des erreurs avec messages détaillés
- **Types TypeScript** : Types complets pour tous les objets Medusa

### Hooks React

Les hooks dans `src/lib/hooks/use-medusa.ts` permettent :

- `useProducts(filters, options)` : Récupération des produits avec filtres
- `useProduct(id, params, options)` : Récupération d'un produit par ID
- `useRegions(filters, options)` : Récupération des régions
- `useProductsByCollection(collectionId, filters, options)` : Produits par collection
- `useProductsByCategory(categoryId, filters, options)` : Produits par catégorie
- `useProductSearch(query, filters, options)` : Recherche de produits

## Utilisation

### 1. Configuration de base

```typescript
// Le client est automatiquement configuré avec les variables d'environnement
import { medusaClient } from "@/lib/api";

// Ou créer un client personnalisé
import { createMedusaClient } from "@/lib/api";

const customClient = createMedusaClient({
  baseUrl: "https://your-backend.com",
  publishableKey: "your-key",
  sellerId: "your-seller-id",
});
```

### 2. Utilisation avec les hooks

```typescript
import { useProducts } from "@/lib/hooks/use-medusa";

export default function ProductList() {
  const { data, loading, error, refetch } = useProducts({
    limit: 12,
    expand: "variants,images,collection",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### 3. Filtres et options

```typescript
// Filtres produits
const { data } = useProducts({
  limit: 20,
  offset: 0,
  collection_id: ["collection-id"],
  category_id: ["category-id"],
  tags: ["tag1", "tag2"],
  title: "search term",
  expand: "variants,images,collection,categories,tags",
});

// Options de cache
const { data } = useProducts({}, {
  enabled: true,
  ttl: 10 * 60 * 1000, // 10 minutes
});
```

### 4. Gestion du cache

```typescript
import { medusaClient } from "@/lib/api";

// Invalider le cache d'un endpoint spécifique
medusaClient.invalidateCache("/store/products", { limit: 10 });

// Invalider tout le cache des produits
medusaClient.invalidateProductCache();

// Vider tout le cache
medusaClient.clearCache();

// Statistiques du cache
const stats = medusaClient.getCacheStats();
console.log(stats);
```

## Middleware Backend

Le backend Medusa doit avoir le middleware suivant pour le support multi-vendeur :

```typescript
// apps/backend/src/api/store/products/middlewares.ts
export const storeProductMiddlewares: MiddlewareRoute[] = [
  {
    methods: ['GET'],
    matcher: '/store/products',
    middlewares: [
      async (req: MedusaRequest, _, next: NextFunction) => {
        if (req.headers.seller_id) {
          req.filterableFields.seller_id = req.headers.seller_id
        }
        return next()
      },
      // ... autres middlewares
    ]
  }
]
```

## Layout Senia

Le layout Senia (`src/layouts/senia.tsx`) fournit :

- **Image hero responsive** : Image horizontale sur desktop, verticale sur mobile
- **Navbar sombre** : Navigation overlay avec thème sombre forcé
- **Footer complet** : Liens organisés et informations de contact
- **Design moderne** : Inspiré de Senia New York avec une esthétique minimaliste

## Pages de démonstration

- `src/pages/senia-example.tsx` : Exemple statique avec le layout Senia
- `src/pages/products-demo.tsx` : Démonstration complète avec API Medusa

## Développement

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Démarrer le serveur de développement
npm run dev

# Builder pour la production
npm run build
```

## Variables d'environnement

```env
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=your-publishable-key
MOTIHARU_SELLER_ID=your-seller-id
```

## Types TypeScript

Tous les types Medusa sont définis dans `src/lib/types/medusa.ts` et incluent :

- `MedusaProduct` : Produit complet avec variantes et images
- `MedusaRegion` : Région avec devises et pays
- `MedusaProductFilters` : Filtres pour la recherche de produits
- `MedusaListResponse<T>` : Réponse de liste avec pagination
- `MedusaSingleResponse<T>` : Réponse pour un élément unique

## Cache

Le cache local utilise :

- **TTL par défaut** : 5 minutes
- **Éviction LRU** : Maximum 100 entrées
- **Clés intelligentes** : Basées sur l'endpoint et les paramètres
- **Invalidation** : Manuelle ou automatique

## Bonnes pratiques

1. **Toujours utiliser les hooks** pour la gestion d'état
2. **Configurer le TTL** selon la fréquence de mise à jour des données
3. **Gérer les états de chargement** et d'erreur
4. **Invalider le cache** après les mutations
5. **Utiliser l'expansion** pour récupérer les données liées en une seule requête
