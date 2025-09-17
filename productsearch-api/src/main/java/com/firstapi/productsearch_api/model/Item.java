package com.firstapi.productsearch_api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double price;
    private Double rating;

    @Column(name = "image_url")
    private String imageUrl;

    private Boolean available;

    public Item() {}

    // getters & setters
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }

    public String getName(){ return name; }
    public void setName(String name){ this.name = name; }

    public String getCategory(){ return category; }
    public void setCategory(String category){ this.category = category; }

    public Double getPrice(){ return price; }
    public void setPrice(Double price){ this.price = price; }

    public Double getRating(){ return rating; }
    public void setRating(Double rating){ this.rating = rating; }

    public String getImageUrl(){ return imageUrl; }
    public void setImageUrl(String imageUrl){ this.imageUrl = imageUrl; }

    public Boolean getAvailable(){ return available; }
    public void setAvailable(Boolean available){ this.available = available; }
}
