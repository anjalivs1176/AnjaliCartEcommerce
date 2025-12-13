package com.Anjali.ECommerce.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// @Entity
// @Getter
// @Setter
// @AllArgsConstructor
// @NoArgsConstructor
// @EqualsAndHashCode
// public class Category {
//     @Id
//     @GeneratedValue(strategy = GenerationType.AUTO)
//     private Long Id;
//     private String name;
//     @Column(unique = true)
//     private String categoryId;
//     @ManyToOne
//     private Category parentCategory;
//     @NotNull
//     private Integer level;
//     //level1 example men women electronics
//     //level2 subcategories example top wear bottom wear traditional
//     //level 3 shirts pants kurtis etc
// }
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String categoryId;

    private String name;

    @ManyToOne
    private Category parentCategory;

    @Column(nullable = false)
    private Integer level;

    private String image;

    private Integer discount;

    private boolean showOnHome = false;

}
