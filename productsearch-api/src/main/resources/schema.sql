CREATE TABLE items (
    id SERIAL PRIMARY KEY,         
    name VARCHAR(100) NOT NULL,    
    category VARCHAR(50) NOT NULL, 
    price DECIMAL(10,2) NOT NULL,  
    rating DECIMAL(2,1),           
    image_url VARCHAR(255),        
    available BOOLEAN DEFAULT true 
);
