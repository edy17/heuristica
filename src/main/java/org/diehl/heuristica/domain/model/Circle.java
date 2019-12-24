package org.diehl.heuristica.domain.model;


import io.quarkus.runtime.annotations.RegisterForReflection;

import java.awt.*;

@RegisterForReflection
public class Circle {

    private Point center;
    private double radius;
    private Line diameter;

    public Circle(Point center, double radius, Line diameter) {
        this.center = center;
        this.radius = radius;
        this.diameter = diameter;
    }

    public Point getCenter() {
        return this.center;
    }

    public double getRadius() {
        return this.radius;
    }
}
