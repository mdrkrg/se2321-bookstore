-- Create book inventory table
CREATE TABLE book_inventory (
    book_id BIGINT NOT NULL,
    stock BIGINT NOT NULL DEFAULT 0,
    sales BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (book_id),
    CONSTRAINT fk_book_inventory_book FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);

-- Populate existing book inventory
INSERT INTO book_inventory (book_id, stock, sales)
SELECT id, stock, sales FROM book;

-- Remove columns
ALTER TABLE book DROP COLUMN stock;
ALTER TABLE book DROP COLUMN sales;
