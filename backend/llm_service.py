import os
from langchain_groq import ChatGroq
from langchain_google_firestore import FirestoreChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.runnables.history import RunnableWithMessageHistory
from dotenv import load_dotenv

# Initialize Firebase DB
from firebase_admin_setup import db

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
api_key = os.environ.get("groq_api_key")

SYSTEM_PROMPT = """You are Bizwiz, an AI-powered business consultant specializing in Indian laws, compliance, and business operations.

Your job is to:
* Analyze documents
* Identify risks and compliance gaps
* Provide actionable guidance
* Reference Indian regulations (GST, Companies Act, Labour Laws)
* Explain penalties clearly
* Suggest preventive and corrective actions

Always structure responses as:
1. Summary
2. Risks
3. Compliance Requirements
4. Penalties
5. Best Practices
6. Action Steps

Be practical, clear, and concise."""

def get_llm():
    if not api_key:
        return None
    return ChatGroq(
        groq_api_key=api_key,
        model_name="llama-3.1-8b-instant",
        temperature=0.3
    )

def analyze_document_text(text):
    llm = get_llm()
    if not llm:
        return "Groq API key not found. Please set groq_api_key in .env"
    try:
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"Please analyze the following document:\n\n{text}")
        ]
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return "Failed to analyze document."

IDEA_PROMPT = """You are Bizwiz, an expert AI business consultant for India.
The user will provide a business idea. You need to analyze it and provide a structured report:
1. Viability & Market Potential (in India)
2. Legal & Regulatory Requirements (Licenses, registrations)
3. Potential Risks & Challenges
4. Estimated Initial Steps to Launch
5. Overall Verdict

Be encouraging but highly practical and realistic."""

def verify_business_idea(idea_text):
    llm = get_llm()
    if not llm:
        return "Groq API key not found."
    try:
        messages = [
            SystemMessage(content=IDEA_PROMPT),
            HumanMessage(content=f"Here is my business idea:\n\n{idea_text}")
        ]
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return "Failed to verify idea."

def get_session_history(chat_id: str) -> FirestoreChatMessageHistory:
    return FirestoreChatMessageHistory(
        collection="chat_history",
        session_id=chat_id,
        client=db
    )

def get_chat_chain(chat_id: str):
    """Returns a simple chain with loaded history (for reading messages)."""
    return get_session_history(chat_id)

def chat_with_bot_langchain(user_input: str, chat_id: str) -> str:
    llm = get_llm()
    if not llm:
        return "Groq API key not found."
    try:
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])

        chain = prompt | llm

        chain_with_history = RunnableWithMessageHistory(
            chain,
            get_session_history,
            input_messages_key="input",
            history_messages_key="history",
        )

        response = chain_with_history.invoke(
            {"input": user_input},
            config={"configurable": {"session_id": chat_id}},
        )
        return response.content
    except Exception as e:
        print(f"Error calling Groq API (LangChain): {e}")
        return "Failed to get response."
