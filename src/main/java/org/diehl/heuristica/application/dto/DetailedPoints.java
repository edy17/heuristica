package org.diehl.heuristica.application.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.diehl.heuristica.domain.model.Circle;
import org.diehl.heuristica.domain.model.Point;

import java.util.ArrayList;

@RegisterForReflection
public class DetailedPoints {

    private String sessionUUID;
    private ArrayList<Point> randomPoints;
    @JsonIgnore
    private Circle minimumCircle;
    @JsonIgnore
    private ArrayList<Point> convexEnvelope;
    @JsonIgnore
    private ArrayList<Point> tsp;
    @JsonIgnore
    private ArrayList<Point> mtsp;
    @JsonIgnore
    private boolean consumedMinimumCircle = false;
    @JsonIgnore
    private boolean consumedConvexEnvelope = false;
    @JsonIgnore
    private boolean consumedTSP = false;
    @JsonIgnore
    private boolean consumedMTSP = false;

    public DetailedPoints(String sessionUUID, ArrayList<Point> randomPoints) {
        this.sessionUUID = sessionUUID;
        this.randomPoints = randomPoints;
    }

    public boolean sessionDetailedPointsHasExpired() {
        return consumedMinimumCircle && consumedConvexEnvelope;
    }

    public String getSessionUUID() {
        return sessionUUID;
    }

    public void setSessionUUID(String sessionUUID) {
        this.sessionUUID = sessionUUID;
    }

    public ArrayList<Point> getRandomPoints() {
        return randomPoints;
    }

    public void setRandomPoints(ArrayList<Point> randomPoints) {
        this.randomPoints = randomPoints;
    }

    public Circle getMinimumCircle() {
        return minimumCircle;
    }

    public void setMinimumCircle(Circle minimumCircle) {
        this.minimumCircle = minimumCircle;
    }

    public ArrayList<Point> getConvexEnvelope() {
        return convexEnvelope;
    }

    public void setConvexEnvelope(ArrayList<Point> convexEnvelope) {
        this.convexEnvelope = convexEnvelope;
    }

    public ArrayList<Point> getTsp() {
        return tsp;
    }

    public void setTsp(ArrayList<Point> tsp) {
        this.tsp = tsp;
    }

    public ArrayList<Point> getMtsp() {
        return mtsp;
    }

    public void setMtsp(ArrayList<Point> mtsp) {
        this.mtsp = mtsp;
    }

    public void setConsumedMinimumCircle(boolean consumedMinimumCircle) {
        this.consumedMinimumCircle = consumedMinimumCircle;
    }

    public void setConsumedConvexEnvelope(boolean consumedConvexEnvelope) {
        this.consumedConvexEnvelope = consumedConvexEnvelope;
    }

    public void setConsumedTSP(boolean consumedTSP) {
        this.consumedTSP = consumedTSP;
    }

    public void setConsumedMTSP(boolean consumedMTSP) {
        this.consumedMTSP = consumedMTSP;
    }
}
