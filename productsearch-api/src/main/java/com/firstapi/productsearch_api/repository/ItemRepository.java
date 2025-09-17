package com.firstapi.productsearch_api.repository;

import com.firstapi.productsearch_api.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    // simple name search (case-insensitive contains)
    List<Item> findByNameIgnoreCaseContaining(String q);
}
