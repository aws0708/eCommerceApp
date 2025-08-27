import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortOrder: string = "";   // this will be used for sorting before and after filter
  constructor(private productService: ProductService,
    private cartService: CartService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    })
  }
  addToCartSnackBar(product: Product) {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.snackBar.open(
          `${product.name} added to cart !`,
          'View Cart',
          {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top',

          }
        ).onAction().subscribe(() => {
          this.router.navigate(['/cart'])
        })
      },
      error: () => {
        this.snackBar.open(
          `Failed to add ${product.name} to cart!!`,
          'Dismiss',
          {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        )
      }
    });
  }

  applyFilter(event: Event) {
    let searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter((product) => {
      return product.name.toLowerCase().includes(searchTerm);
    })
    // after searching/filtering we also want to sort
    this.sortProducts(this.sortOrder);

  }

  sortProducts(sortValue: string) {
    this.sortOrder = sortValue;
    if (this.sortOrder === "priceLowHigh") {
      this.filteredProducts.sort((a, b) => a.price - b.price)
    }
    else if (this.sortOrder === "priceHighLow") {
      this.filteredProducts.sort((a, b) => b.price - a.price)
    }
  }



}
