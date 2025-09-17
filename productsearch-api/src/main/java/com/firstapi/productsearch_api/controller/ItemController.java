package com.firstapi.productsearch_api.controller;

import com.firstapi.productsearch_api.model.Item;
import com.firstapi.productsearch_api.service.ItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ItemController {
    private final ItemService svc;

    public ItemController(ItemService svc) {
        this.svc = svc;
    }

    // GET /api/search?q=...
    @GetMapping("/search")
    public List<Item> search(@RequestParam(value = "q", required = false) String q) {
        return svc.search(q);
    }

    // GET /api/items/{id}
    @GetMapping("/items/{id}")
    public Item getItem(@PathVariable Long id) {
        return svc.findById(id);
    }
}

