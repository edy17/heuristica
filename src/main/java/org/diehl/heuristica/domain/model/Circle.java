package org.diehl.heuristica.domain.model;


import io.quarkus.runtime.annotations.RegisterForReflection;

import javax.validation.constraints.NotNull;
import java.awt.*;

@RegisterForReflection
public class Circle {

    @NotNull
    private Point center;
    @NotNull
    private int radius;

    public Point getCenter() {
        return this.center;
    }

    public int getRadius() {
        return this.radius;
    }
}
