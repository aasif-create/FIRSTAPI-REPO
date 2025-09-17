CREATE TABLE items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(255),
    price DOUBLE,
    rating DOUBLE,
    image_url VARCHAR(500),
    available BOOLEAN
);
