"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editing, setEditing] = useState<Review | null>(null);
  const [message, setMessage] = useState("");

  async function loadReviews() {
    const response = await fetch("/api/admin/reviews", { cache: "no-store" });
    const data = (await response.json()) as { items?: Review[] };
    setReviews(data.items ?? []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") ?? ""),
      text: String(form.get("text") ?? ""),
      rating: Number(form.get("rating") ?? 5),
      date: String(form.get("date") ?? ""),
      displayOrder: Number(form.get("displayOrder") ?? 0),
      status: String(form.get("status") ?? "ACTIVE") as Review["status"],
    };

    const response = await fetch(editing ? `/api/admin/reviews/${editing.id}` : "/api/admin/reviews", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Could not save review. Please check the fields (name and review text are required).");
      return;
    }

    formElement.reset();
    setEditing(null);
    setMessage(editing ? "Review updated." : "Review added.");
    await loadReviews();
  }

  function startEditing(review: Review) {
    setEditing(review);
    setMessage("");
  }

  function cancelEditing() {
    setEditing(null);
    setMessage("");
  }

  async function deleteReview(review: Review) {
    const confirmed = window.confirm(`Delete the review by ${review.name}? This cannot be undone.`);
    if (!confirmed) return;

    await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
    setMessage("Review deleted.");
    await loadReviews();
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p>Reviews</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/#reviews-heading" className="admin-outline-button">
            View on Site
          </Link>
        </div>
      </header>

      <section className="admin-categories-layout">
        <form onSubmit={handleSubmit} className="admin-resource-card admin-category-form admin-categories-form" key={editing?.id ?? "new-review"}>
          <h2>{editing ? "Edit Review" : "Add Review"}</h2>
          <label>
            Customer Name
            <input name="name" defaultValue={editing?.name} placeholder="e.g. Riya Sharma" required />
          </label>
          <label>
            Review Text
            <textarea name="text" defaultValue={editing?.text} placeholder="What the customer said about Chocobee" required />
          </label>
          <label>
            Rating
            <select name="rating" defaultValue={String(editing?.rating ?? 5)}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </label>
          <label>
            Date Label
            <input name="date" defaultValue={editing?.date ?? ""} placeholder="e.g. 2 weeks ago" required />
          </label>
          <label>
            Display Order
            <input name="displayOrder" type="number" defaultValue={editing?.displayOrder ?? reviews.length + 1} />
          </label>
          <label>
            Status
            <select name="status" defaultValue={editing?.status ?? "ACTIVE"}>
              <option value="ACTIVE">Visible</option>
              <option value="INACTIVE">Hidden</option>
            </select>
          </label>
          <button type="submit">{editing ? "Update Review" : "Add Review"}</button>
          {editing ? (
            <button type="button" className="admin-secondary-button" onClick={cancelEditing}>
              Cancel Edit
            </button>
          ) : null}
          {message ? <p role="status">{message}</p> : null}
        </form>

        <section className="admin-table-card admin-categories-table">
          <div>
            <h2>All Reviews</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Date</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className={editing?.id === review.id ? "admin-home-section-active" : undefined}>
                  <td>{review.name}</td>
                  <td>{review.text}</td>
                  <td>{"★".repeat(review.rating)}</td>
                  <td>{review.date}</td>
                  <td>{review.displayOrder}</td>
                  <td>
                    <span>{review.status === "ACTIVE" ? "Visible" : "Hidden"}</span>
                  </td>
                  <td>
                    <button type="button" onClick={() => startEditing(review)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => void deleteReview(review)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
