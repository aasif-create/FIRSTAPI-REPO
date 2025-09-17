package com.firstapi.productsearch_api.service;

import com.firstapi.productsearch_api.model.Item;
import com.firstapi.productsearch_api.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ItemService {
    private final ItemRepository repo;

    public ItemService(ItemRepository repo) {
        this.repo = repo;
    }

    public List<Item> search(String q) {
        if (q == null || q.trim().isEmpty()) {
            // return empty list instead of all items
            return Collections.emptyList();
        }
        return repo.findByNameIgnoreCaseContaining(q.trim());
    }

    public Item findById(Long id) {
        return repo.findById(id).orElse(null);
    }
}
